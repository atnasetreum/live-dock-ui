"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";

import { useCurrentUser } from "@/common/UserContext";
import { usersService, UserPayload } from "@/services";
import { useThemeConfig } from "@/theme/ThemeProvider";
import { ProcessEventRole, User } from "@/types";
import { Toast } from "@/utils";

type FormState = {
  name: string;
  email: string;
  role: ProcessEventRole | "";
  password: string;
};

type SortDirection = "asc" | "desc";
type SortField = "name" | "email" | "role";

const ROLE_OPTIONS: ProcessEventRole[] = [
  ProcessEventRole.ADMIN,
  ProcessEventRole.VIGILANCIA,
  ProcessEventRole.LOGISTICA,
  ProcessEventRole.CALIDAD,
  ProcessEventRole.PRODUCCION,
  ProcessEventRole.SISTEMA,
];

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  role: "",
  password: "",
};

const UsersPage = () => {
  const { theme } = useThemeConfig();
  const currentUser = useCurrentUser();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteBusy, setIsDeleteBusy] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<"TODOS" | ProcessEventRole>(
    "TODOS",
  );
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    undefined,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const isAdmin = currentUser.role === ProcessEventRole.ADMIN;
  const tableHeaderBackground =
    theme.name === "dark" ? "rgba(255,255,255,0.08)" : "rgba(11,27,45,0.08)";
  const actionEditBorder =
    theme.palette.primary?.main ??
    (theme.name === "dark" ? "#38bdf8" : "#2563eb");
  const actionEditText =
    theme.palette.primary?.main ??
    (theme.name === "dark" ? "#7dd3fc" : "#1e40af");
  const actionEditFill =
    theme.name === "dark" ? "rgba(56,189,248,0.24)" : "rgba(37,99,235,0.2)";
  const actionDeleteBorder =
    theme.palette.error?.main ??
    (theme.name === "dark" ? "#f87171" : "#ef4444");
  const actionDeleteText =
    theme.palette.error?.main ??
    (theme.name === "dark" ? "#fca5a5" : "#b91c1c");
  const actionDeleteFill =
    theme.name === "dark" ? "rgba(248,113,113,0.24)" : "rgba(239,68,68,0.2)";
  const rowHoverBackground =
    theme.name === "dark" ? "rgba(255,255,255,0.06)" : "rgba(11,27,45,0.06)";
  const rowHoverInnerBorder =
    theme.name === "dark" ? "rgba(56,189,248,0.28)" : "rgba(37,99,235,0.24)";

  const sortLabelSx = {
    color: theme.palette.textPrimary,
    "&:hover": {
      color: theme.palette.textPrimary,
    },
    "&.Mui-active": {
      color: theme.palette.textPrimary,
    },
    "& .MuiTableSortLabel-icon": {
      color: `${theme.palette.textPrimary} !important`,
    },
  };

  const refreshUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await usersService.findAll();
      setUsers(response);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  useEffect(() => {
    setPage(0);
  }, [globalFilter, roleFilter, sortField, sortDirection]);

  const handleSortByField = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection("asc");
      return;
    }

    if (sortDirection === "asc") {
      setSortDirection("desc");
      return;
    }

    if (sortDirection === "desc") {
      setSortField(undefined);
      setSortDirection(undefined);
      return;
    }

    setSortDirection("asc");
  };

  const visibleUsers = useMemo(() => {
    const query = globalFilter.trim().toLowerCase();

    const filtered = users.filter((user) => {
      const matchesRole = roleFilter === "TODOS" || user.role === roleFilter;

      if (!matchesRole) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });

    if (!sortField || !sortDirection) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      const valueA = String(a[sortField]).toLowerCase();
      const valueB = String(b[sortField]).toLowerCase();
      const compareResult = valueA.localeCompare(valueB, "es", {
        sensitivity: "base",
      });

      return sortDirection === "asc" ? compareResult : -compareResult;
    });
  }, [users, globalFilter, roleFilter, sortField, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return visibleUsers.slice(start, end);
  }, [visibleUsers, page, rowsPerPage]);

  const resetForm = () => {
    setEditingUser(null);
    setShowCreatePassword(false);
    setForm(INITIAL_FORM);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    if (isSaving) return;
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSave = async () => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email) {
      Toast.error("Nombre y correo son obligatorios.");
      return;
    }

    if (!form.role) {
      Toast.error("Debes seleccionar un rol.");
      return;
    }

    if (!editingUser && !form.password.trim()) {
      Toast.error("La contraseña es obligatoria para crear usuarios.");
      return;
    }

    const payload: UserPayload = {
      name,
      email,
      role: form.role,
      ...(form.password.trim() ? { password: form.password.trim() } : {}),
    };

    setIsSaving(true);
    try {
      if (editingUser) {
        await usersService.update(String(editingUser.id), payload);
        Toast.success("Usuario actualizado correctamente.");
      } else {
        await usersService.create(payload);
        Toast.success("Usuario creado correctamente.");
      }
      await refreshUsers();
      closeDialog();
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
  };

  const closeDeleteDialog = () => {
    if (isDeleteBusy) return;
    setUserToDelete(null);
  };

  const handleDelete = async (userId: number) => {
    setIsDeleteBusy(userId);
    try {
      await usersService.remove(String(userId));
      Toast.success("Usuario eliminado correctamente.");
      await refreshUsers();
      setUserToDelete(null);
    } finally {
      setIsDeleteBusy(null);
    }
  };

  if (!isAdmin) {
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          background: theme.surfaces.panel,
          color: theme.palette.textPrimary,
          border: `1px solid ${theme.surfaces.border}`,
          boxShadow: theme.overlays.panelShadow,
        }}
      >
        <Alert severity="warning">Acceso restringido al rol ADMIN.</Alert>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          background: theme.surfaces.panel,
          color: theme.palette.textPrimary,
          border: `1px solid ${theme.surfaces.border}`,
          boxShadow: theme.overlays.panelShadow,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ color: theme.palette.textPrimary, fontWeight: 700 }}
            >
              Gestion de usuarios
            </Typography>
            <Typography sx={{ color: theme.palette.textSecondary }}>
              Modulo CRUD disponible solo para administradores.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={openCreateDialog}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              backgroundImage: theme.gradients.primary,
              color: theme.buttons.containedText,
            }}
          >
            Nuevo usuario
          </Button>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              color: theme.palette.textPrimary,
              "& fieldset": {
                borderColor: theme.surfaces.border,
              },
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.textSecondary,
            },
          }}
        >
          <TextField
            label="Buscar por nombre o correo"
            placeholder="Ej. Eduardo o @hadamexico.com"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            fullWidth
            autoComplete="off"
          />

          <TextField
            select
            label="Rol"
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as "TODOS" | ProcessEventRole)
            }
            sx={{ minWidth: { xs: "100%", md: 200 } }}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            {ROLE_OPTIONS.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Box
          sx={{
            borderRadius: 2,
            border: `1px solid ${theme.surfaces.border}`,
            overflowX: "auto",
          }}
        >
          <Table
            size="small"
            sx={{
              "& .MuiTableCell-root": {
                color: theme.palette.textPrimary,
                borderBottomColor: theme.surfaces.border,
                transition:
                  "background-color 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                color: theme.palette.textSecondary,
                fontWeight: 700,
                backgroundColor: tableHeaderBackground,
              },
              "& .MuiTableBody-root .MuiTableRow-root:hover .MuiTableCell-root":
                {
                  backgroundColor: rowHoverBackground,
                  boxShadow: `inset 0 1px 0 ${rowHoverInnerBorder}, inset 0 -1px 0 ${rowHoverInnerBorder}`,
                },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "name" && Boolean(sortDirection)}
                    direction={
                      sortField === "name" && sortDirection
                        ? sortDirection
                        : "asc"
                    }
                    onClick={() => handleSortByField("name")}
                    sx={sortLabelSx}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "email" && Boolean(sortDirection)}
                    direction={
                      sortField === "email" && sortDirection
                        ? sortDirection
                        : "asc"
                    }
                    onClick={() => handleSortByField("email")}
                    sx={sortLabelSx}
                  >
                    Correo
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "role" && Boolean(sortDirection)}
                    direction={
                      sortField === "role" && sortDirection
                        ? sortDirection
                        : "asc"
                    }
                    onClick={() => handleSortByField("role")}
                    sx={sortLabelSx}
                  >
                    Rol
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>Cargando usuarios...</TableCell>
                </TableRow>
              ) : paginatedUsers.length ? (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{
                          color: theme.palette.textPrimary,
                          backgroundColor: theme.surfaces.translucent,
                          border: `1px solid ${theme.surfaces.border}`,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditOutlinedIcon fontSize="small" />}
                          onClick={() => openEditDialog(user)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderColor: actionEditBorder,
                            color: actionEditText,
                            backgroundColor: actionEditFill,
                            "&:hover": {
                              borderColor: actionEditBorder,
                              color: actionEditText,
                              backgroundColor:
                                theme.name === "dark"
                                  ? "rgba(56,189,248,0.34)"
                                  : "rgba(37,99,235,0.3)",
                            },
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<DeleteOutlineIcon fontSize="small" />}
                          disabled={isDeleteBusy === user.id}
                          onClick={() => openDeleteDialog(user)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderColor: actionDeleteBorder,
                            color: actionDeleteText,
                            backgroundColor: actionDeleteFill,
                            "&:hover": {
                              borderColor: actionDeleteBorder,
                              color: actionDeleteText,
                              backgroundColor:
                                theme.name === "dark"
                                  ? "rgba(248,113,113,0.34)"
                                  : "rgba(239,68,68,0.3)",
                            },
                            "&.Mui-disabled": {
                              color: theme.palette.textSecondary,
                              borderColor: theme.surfaces.border,
                            },
                          }}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    {users.length
                      ? "No hay resultados para los filtros aplicados."
                      : "No hay usuarios registrados."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={visibleUsers.length}
            page={page}
            onPageChange={(_event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por pagina"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mas de ${to}`}`
            }
            sx={{
              color: theme.palette.textPrimary,
              borderTop: `1px solid ${theme.surfaces.border}`,
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  color: theme.palette.textSecondary,
                },
              "& .MuiTablePagination-select": {
                color: theme.palette.textPrimary,
              },
              "& .MuiSelect-icon": {
                color: theme.palette.textPrimary,
              },
            }}
          />
        </Box>
      </Paper>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor:
                theme.name === "dark"
                  ? "rgba(2, 6, 23, 0.72)"
                  : "rgba(11, 27, 45, 0.38)",
              backdropFilter: "blur(3px)",
            },
          },
          paper: {
            sx: {
              background:
                theme.name === "dark"
                  ? "rgba(7,11,32,0.98)"
                  : "rgba(255,255,255,0.99)",
              color: theme.palette.textPrimary,
              border: `1px solid ${theme.surfaces.border}`,
              boxShadow: theme.overlays.panelShadow,
              borderRadius: 3,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${theme.surfaces.border}`,
            backgroundColor: theme.surfaces.translucent,
            fontWeight: 700,
          }}
        >
          {editingUser ? "Editar usuario" : "Crear usuario"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5, backgroundColor: "transparent" }}>
          <Stack
            spacing={2}
            sx={{
              mt: 3,
              "& .MuiOutlinedInput-root": {
                color: theme.palette.textPrimary,
                "& fieldset": {
                  borderColor: theme.surfaces.border,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.textSecondary,
                },
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.textSecondary,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.textPrimary,
              },
            }}
          >
            <TextField
              label="Nombre"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              fullWidth
              autoComplete="off"
            />
            <TextField
              label="Correo"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              fullWidth
              autoComplete="off"
            />
            <TextField
              select
              label="Rol"
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  role: event.target.value as ProcessEventRole | "",
                }))
              }
              fullWidth
            >
              <MenuItem value="" disabled>
                Selecciona un rol
              </MenuItem>
              {ROLE_OPTIONS.map((role) => (
                <MenuItem value={role} key={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={editingUser ? "Nueva contraseña (opcional)" : "Contraseña"}
              type={!editingUser && showCreatePassword ? "text" : "password"}
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              fullWidth
              autoComplete="off"
              slotProps={{
                input: !editingUser
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowCreatePassword((current) => !current)
                            }
                            edge="end"
                            aria-label={
                              showCreatePassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                            sx={{ color: theme.palette.textSecondary }}
                          >
                            {showCreatePassword ? (
                              <VisibilityOffOutlinedIcon fontSize="small" />
                            ) : (
                              <VisibilityOutlinedIcon fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : undefined,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.surfaces.border}`,
            backgroundColor: theme.surfaces.translucent,
            px: 2,
            py: 1.5,
          }}
        >
          <Button
            onClick={closeDialog}
            disabled={isSaving}
            sx={{ color: theme.palette.textSecondary }}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={isSaving}>
            {editingUser ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(userToDelete)}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor:
                theme.name === "dark"
                  ? "rgba(2, 6, 23, 0.72)"
                  : "rgba(11, 27, 45, 0.38)",
              backdropFilter: "blur(3px)",
            },
          },
          paper: {
            sx: {
              background:
                theme.name === "dark"
                  ? "rgba(7,11,32,0.98)"
                  : "rgba(255,255,255,0.99)",
              color: theme.palette.textPrimary,
              border: `1px solid ${theme.surfaces.border}`,
              boxShadow: theme.overlays.panelShadow,
              borderRadius: 3,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${theme.surfaces.border}`,
            backgroundColor: theme.surfaces.translucent,
            fontWeight: 700,
          }}
        >
          Confirmar eliminación
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <Typography sx={{ color: theme.palette.textPrimary, pt: 2.5 }}>
            ¿Seguro que deseas eliminar al usuario
            <strong>{` ${userToDelete?.name ?? ""}`}</strong>?
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.textSecondary, mt: 1 }}
          >
            Esta acción desactivará su cuenta.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.surfaces.border}`,
            backgroundColor: theme.surfaces.translucent,
            px: 2,
            py: 1.5,
          }}
        >
          <Button
            onClick={closeDeleteDialog}
            disabled={Boolean(isDeleteBusy)}
            sx={{ color: theme.palette.textSecondary }}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={!userToDelete || Boolean(isDeleteBusy)}
            onClick={() => {
              if (!userToDelete) return;
              handleDelete(userToDelete.id);
            }}
          >
            Confirmar eliminación
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersPage;
