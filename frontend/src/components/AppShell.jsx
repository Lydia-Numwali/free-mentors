import { useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Link as RouterLink, NavLink, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../features/auth/authSlice";
import { getRoleLabel, getSidebarItems } from "../utils/role";

const drawerWidth = 292;

function SidebarContent({ pathname, role, user, onNavigate, onSignOut }) {
  const items = useMemo(() => getSidebarItems(role), [role]);

  return (
    <Stack sx={{ height: "100%", p: 2.5 }}>
      <Stack spacing={2.5}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.14)",
                color: "#ffffff",
                width: 52,
                height: 52,
              }}
            >
              FM
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700 }}>
                Free Mentors
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
                Mentorship space
              </Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Chip
              label={getRoleLabel(role)}
              size="small"
              sx={{
                mb: 1.5,
                bgcolor: "rgba(255,255,255,0.16)",
                color: "#ffffff",
              }}
            />
            <Typography sx={{ color: "#ffffff", fontWeight: 700 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)" }}>
              {user?.email}
            </Typography>
          </Box>
        </Stack>

        <List sx={{ p: 0 }}>
          {items.map((item) => {
            const selected =
              pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
            const Icon = item.icon;

            return (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                onClick={onNavigate}
                sx={{
                  mb: 1,
                  minHeight: 52,
                  borderRadius: 2,
                  color: selected ? "#001526" : "rgba(255,255,255,0.82)",
                  backgroundColor: selected ? "#ffffff" : "transparent",
                  "&:hover": {
                    backgroundColor: selected
                      ? "#ffffff"
                      : "rgba(255,255,255,0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: "inherit", minWidth: 40 }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Stack>

      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }} />
        <Button
          fullWidth
          startIcon={<LogoutRoundedIcon />}
          onClick={onSignOut}
          sx={{
            color: "#ffffff",
            borderColor: "rgba(255,255,255,0.18)",
          }}
          variant="outlined"
        >
          Sign out
        </Button>
      </Box>
    </Stack>
  );
}

export default function AppShell() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || "user";

  return (
    <Box className="page-shell" sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ gap: 2, minHeight: "80px !important" }}>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { lg: "none" } }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {getRoleLabel(role)} space
            </Typography>
            <Typography color="text.secondary">
              {role === "admin"
                ? "Keep the community moving with care."
                : role === "mentor"
                  ? "Respond to people who are asking for your guidance."
                  : "Find guidance and keep your conversations close."}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.25} alignItems="center">
            <Chip
              icon={<AutoAwesomeRoundedIcon />}
              label={getRoleLabel(role)}
              color="primary"
              variant="outlined"
            />
            <Button
              component={RouterLink}
              to="/"
              variant="text"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Back to site
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <SidebarContent
            pathname={location.pathname}
            role={role}
            user={user}
            onNavigate={() => setMobileOpen(false)}
            onSignOut={() => dispatch(signOut())}
          />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: 0,
            },
          }}
        >
          <SidebarContent
            pathname={location.pathname}
            role={role}
            user={user}
            onNavigate={() => undefined}
            onSignOut={() => dispatch(signOut())}
          />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar sx={{ minHeight: "80px !important" }} />
        <Box sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
