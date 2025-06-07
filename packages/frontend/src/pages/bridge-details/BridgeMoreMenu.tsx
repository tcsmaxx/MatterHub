import MoreVert from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router";
import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ResetIcon from "@mui/icons-material/RotateLeft";
import { navigation } from "../../routes.tsx";
import { useDeleteBridge, useResetBridge } from "../../hooks/data/bridges.ts";
import { useNotifications } from "../../components/notifications/use-notifications.ts";

export interface BridgeMoreMenuProps {
  bridge: string;
}

export const BridgeMoreMenu = ({ bridge }: BridgeMoreMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const notification = useNotifications();

  const factoryReset = useResetBridge();
  const deleteBridge = useDeleteBridge();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleFactoryReset = async () => {
    handleClose();
    await factoryReset(bridge)
      .then(() =>
        notification.show({
          message: "Bridge Reset successfully",
          severity: "success",
        }),
      )
      .catch((reason) =>
        notification.show({
          message: `Failed to reset bridge: ${reason.toString()}`,
          severity: "error",
        }),
      );
  };
  const handleDelete = async () => {
    handleClose();
    await deleteBridge(bridge)
      .then(() =>
        notification.show({
          message: "Bridge deleted successfully",
          severity: "success",
        }),
      )
      .then(() => navigate(navigation.bridges))
      .catch((reason) =>
        notification.show({
          message: `Failed to delete bridge: ${reason.toString()}`,
          severity: "error",
        }),
      );
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <MoreVert />
      </IconButton>
      <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
        <MenuItem component={RouterLink} to={navigation.editBridge(bridge)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleFactoryReset}>
          <ListItemIcon>
            <ResetIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Factory Reset</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
