import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PushNotificationRequest({
  isOpen,
  handleClose,
}: Readonly<{
  isOpen: boolean;
  handleClose: (confirm: boolean) => void;
}>) {
  return (
    <Dialog
      open={isOpen}
      slots={{
        transition: Transition,
      }}
      keepMounted
      onClose={() => handleClose(false)}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>¿Utilizar el servicio de notificaciones?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Esta aplicación web desea enviarle notificaciones para mantenerlo
          informado sobre actualizaciones importantes y eventos relevantes.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="error">
          Cancelar
        </Button>
        <Button
          onClick={() => handleClose(true)}
          variant="contained"
          color="info"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PushNotificationRequest;
