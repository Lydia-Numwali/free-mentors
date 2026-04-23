from __future__ import annotations

import graphene
from django.contrib.auth.hashers import check_password, make_password
from graphql import GraphQLError

from .auth import create_token, require_auth
from .repositories import (
    UserPayload,
    reviews_repository,
    sessions_repository,
    users_repository,
)


class ReviewType(graphene.ObjectType):
    id = graphene.ID(required=True)
    rating = graphene.Int(required=True)
    comment = graphene.String(required=True)
    is_visible = graphene.Boolean(required=True, name="isVisible")
    mentor = graphene.Field(lambda: UserType, required=True)
    mentee = graphene.Field(lambda: UserType, required=True)

    def resolve_mentor(self, _info):
        return users_repository.get_by_id(self["mentor_id"])

    def resolve_mentee(self, _info):
        return users_repository.get_by_id(self["mentee_id"])


class UserType(graphene.ObjectType):
    id = graphene.ID(required=True)
    first_name = graphene.String(required=True, name="firstName")
    last_name = graphene.String(required=True, name="lastName")
    email = graphene.String(required=True)
    role = graphene.String(required=True)
    signup_goal = graphene.String(required=True, name="signupGoal")
    mentor_application_status = graphene.String(required=True, name="mentorApplicationStatus")
    bio = graphene.String()
    expertise = graphene.String()
    is_active = graphene.Boolean(required=True, name="isActive")
    reviews = graphene.List(ReviewType, required=True)

    def resolve_reviews(self, _info):
        if self["role"] != "mentor":
            return []
        return reviews_repository.list_for_mentor(self["id"])


class MentorshipSessionType(graphene.ObjectType):
    id = graphene.ID(required=True)
    request_id = graphene.String(required=True, name="requestId")
    agenda = graphene.String(required=True)
    message = graphene.String(required=True)
    status = graphene.String(required=True)
    mentor = graphene.Field(UserType, required=True)
    mentee = graphene.Field(UserType, required=True)
    review = graphene.Field(ReviewType)

    def resolve_mentor(self, _info):
        return users_repository.get_by_id(self["mentor_id"])

    def resolve_mentee(self, _info):
        return users_repository.get_by_id(self["mentee_id"])

    def resolve_review(self, _info):
        return reviews_repository.get_by_session(self["id"])


class AuthPayload(graphene.ObjectType):
    token = graphene.String(required=True)
    user = graphene.Field(UserType, required=True)


class SignUpInput(graphene.InputObjectType):
    first_name = graphene.String(required=True, name="firstName")
    last_name = graphene.String(required=True, name="lastName")
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    signup_goal = graphene.String(required=True, name="signupGoal")


class PromoteMentorInput(graphene.InputObjectType):
    user_id = graphene.ID(required=True, name="userId")
    bio = graphene.String(required=True)
    expertise = graphene.String(required=True)


class SessionRequestInput(graphene.InputObjectType):
    mentor_id = graphene.ID(required=True, name="mentorId")
    agenda = graphene.String(required=True)
    message = graphene.String(required=True)


class CreateReviewInput(graphene.InputObjectType):
    session_id = graphene.ID(required=True, name="sessionId")
    rating = graphene.Int(required=True)
    comment = graphene.String(required=True)


def normalize_signup_goal(value: str) -> str:
    goal = (value or "").strip().lower()
    if goal not in {"mentor", "mentee"}:
        raise GraphQLError("Signup goal must be mentor or mentee.")
    return goal


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType, required=True)
    mentors = graphene.List(UserType, required=True)
    mentor = graphene.Field(UserType, mentorId=graphene.ID(required=True))
    mySessions = graphene.List(MentorshipSessionType, required=True)
    reviews = graphene.List(ReviewType, required=True)
    pendingMentorApplicants = graphene.List(UserType, required=True)

    @require_auth()
    def resolve_me(self, info, current_user):
        return current_user

    @require_auth(role="admin")
    def resolve_users(self, info, current_user):
        return users_repository.list_all()

    @require_auth()
    def resolve_mentors(self, info, current_user):
        return users_repository.list_mentors()

    @require_auth()
    def resolve_mentor(self, info, mentorId, current_user):
        mentor = users_repository.get_by_id(mentorId)
        if not mentor or mentor["role"] != "mentor":
            raise GraphQLError("Mentor not found.")
        return mentor

    @require_auth()
    def resolve_mySessions(self, info, current_user):
        return sessions_repository.list_for_user(current_user["id"], current_user["role"])

    @require_auth(role="admin")
    def resolve_reviews(self, info, current_user):
        return reviews_repository.list_all()

    @require_auth(role="admin")
    def resolve_pendingMentorApplicants(self, info, current_user):
        return users_repository.list_pending_mentor_applicants()


class SignUp(graphene.Mutation):
    class Arguments:
        input = SignUpInput(required=True)

    Output = AuthPayload

    def mutate(self, _info, input):
        email = input.email.lower().strip()
        if users_repository.get_by_email(email):
            raise GraphQLError("A user with this email already exists.")

        signup_goal = normalize_signup_goal(input.signup_goal)
        is_first_user = users_repository.count_all() == 0
        role = "admin" if is_first_user else "user"
        mentor_application_status = (
            "approved"
            if role == "admin"
            else "pending" if signup_goal == "mentor" else "not_requested"
        )

        user = users_repository.create(
            UserPayload(
                first_name=input.first_name.strip(),
                last_name=input.last_name.strip(),
                email=email,
                password_hash=make_password(input.password),
                role=role,
                signup_goal=signup_goal,
                mentor_application_status=mentor_application_status,
            )
        )
        return AuthPayload(token=create_token(user["id"]), user=user)


class SignIn(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    Output = AuthPayload

    def mutate(self, _info, email, password):
        user = users_repository.get_by_email(email.lower().strip())
        if not user or not check_password(password, user["password_hash"]):
            raise GraphQLError("Invalid email or password.")
        return AuthPayload(token=create_token(user["id"]), user=user)


class PromoteToMentor(graphene.Mutation):
    class Arguments:
        input = PromoteMentorInput(required=True)

    Output = UserType

    @require_auth(role="admin")
    def mutate(self, info, input, current_user):
        user = users_repository.promote_to_mentor(
            input.user_id,
            input.bio.strip(),
            input.expertise.strip(),
        )
        if not user:
            raise GraphQLError("User not found.")
        return user


class CreateSessionRequest(graphene.Mutation):
    class Arguments:
        input = SessionRequestInput(required=True)

    Output = MentorshipSessionType

    @require_auth()
    def mutate(self, info, input, current_user):
        if current_user["role"] != "user":
            raise GraphQLError("Only end users can create mentorship session requests.")

        mentor = users_repository.get_by_id(input.mentor_id)
        if not mentor or mentor["role"] != "mentor":
            raise GraphQLError("Mentor not found.")

        return sessions_repository.create(
            mentee_id=current_user["id"],
            mentor_id=input.mentor_id,
            agenda=input.agenda.strip(),
            message=input.message.strip(),
        )


class AcceptSessionRequest(graphene.Mutation):
    class Arguments:
        sessionId = graphene.ID(required=True)

    Output = MentorshipSessionType

    @require_auth(role="mentor")
    def mutate(self, info, sessionId, current_user):
        session = sessions_repository.get_by_id(sessionId)
        if not session:
            raise GraphQLError("Session request not found.")
        if session["mentor_id"] != current_user["id"]:
            raise GraphQLError("You can only manage your own mentorship requests.")
        return sessions_repository.update_status(sessionId, "accepted")


class DeclineSessionRequest(graphene.Mutation):
    class Arguments:
        sessionId = graphene.ID(required=True)

    Output = MentorshipSessionType

    @require_auth(role="mentor")
    def mutate(self, info, sessionId, current_user):
        session = sessions_repository.get_by_id(sessionId)
        if not session:
            raise GraphQLError("Session request not found.")
        if session["mentor_id"] != current_user["id"]:
            raise GraphQLError("You can only manage your own mentorship requests.")
        return sessions_repository.update_status(sessionId, "declined")


class CreateReview(graphene.Mutation):
    class Arguments:
        input = CreateReviewInput(required=True)

    Output = ReviewType

    @require_auth()
    def mutate(self, info, input, current_user):
        if current_user["role"] != "user":
            raise GraphQLError("Only end users can review mentors.")
        if input.rating < 1 or input.rating > 5:
            raise GraphQLError("Rating must be between 1 and 5.")

        session = sessions_repository.get_by_id(input.session_id)
        if not session:
            raise GraphQLError("Session not found.")
        if session["mentee_id"] != current_user["id"]:
            raise GraphQLError("You can only review your own sessions.")
        if session["status"] != "accepted":
            raise GraphQLError("Only accepted sessions can be reviewed.")
        if reviews_repository.get_by_session(session["id"]):
            raise GraphQLError("This session has already been reviewed.")

        return reviews_repository.create(
            session_id=session["id"],
            mentor_id=session["mentor_id"],
            mentee_id=current_user["id"],
            rating=input.rating,
            comment=input.comment.strip(),
        )


class HideReview(graphene.Mutation):
    class Arguments:
        reviewId = graphene.ID(required=True)

    Output = ReviewType

    @require_auth(role="admin")
    def mutate(self, info, reviewId, current_user):
        review = reviews_repository.hide(reviewId)
        if not review:
            raise GraphQLError("Review not found.")
        return review


class Mutation(graphene.ObjectType):
    signUp = SignUp.Field()
    signIn = SignIn.Field()
    promoteToMentor = PromoteToMentor.Field()
    createSessionRequest = CreateSessionRequest.Field()
    acceptSessionRequest = AcceptSessionRequest.Field()
    declineSessionRequest = DeclineSessionRequest.Field()
    createReview = CreateReview.Field()
    hideReview = HideReview.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
