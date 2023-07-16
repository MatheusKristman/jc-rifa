import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useRaffleStore from "../../../stores/useRaffleStore";
import useGeneralStore from "../../../stores/useGeneralStore";
import api from "../../../services/api";

const DeleteConfirmationBox = () => {
  const {
    closeDeleteConfirmation,
    isDeleteConfirmationAnimated,
    deactivateDeleteConfirmationAnimation,
    raffleSelected,
    setRaffles,
  } = useRaffleStore((state) => ({
    closeDeleteConfirmation: state.closeDeleteConfirmation,
    isDeleteConfirmationAnimated: state.isDeleteConfirmationAnimated,
    deactivateDeleteConfirmationAnimation:
      state.deactivateDeleteConfirmationAnimation,
    raffleSelected: state.raffleSelected,
    setRaffles: state.setRaffles,
  }));
  const { setToLoad, setNotToLoad } = useGeneralStore((state) => ({
    setToLoad: state.setToLoad,
    setNotToLoad: state.setNotToLoad,
  }));
  const navigate = useNavigate();

  const closeModal = () => {
    deactivateDeleteConfirmationAnimation();

    setTimeout(() => {
      closeDeleteConfirmation();
    }, 1000);
  };

  const handleCancel = () => {
    closeModal();
  };

  const handleConfirm = () => {
    setToLoad();
    api
      .delete(`/delete-raffle/${raffleSelected._id}`)
      .then((res) => {
        setRaffles(res.data);
        toast.success("Rifa deletada com sucesso", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((error) => {
        toast.error("Ocorreu um erro durante o processo de excluir a rifa", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.error(error);
      })
      .finally(() => {
        setNotToLoad();
        closeModal();
        navigate("/raffle-management");
      });
  };

  return (
    <div
      className={
        isDeleteConfirmationAnimated
          ? "animate__animated animate__fadeIn edit-raffle__confirmation-overlay"
          : "animate__animated animate__fadeOut edit-raffle__confirmation-overlay"
      }
    >
      <div
        className={
          isDeleteConfirmationAnimated
            ? "animate__animated animate__fadeInDown edit-raffle__confirmation-overlay__box"
            : "animate__animated animate__fadeOutUp edit-raffle__confirmation-overlay__box"
        }
      >
        <h3 className="edit-raffle__confirmation-overlay__box__confirmation-title">
          Você tem certeza que quer excluir essa rifa?
        </h3>

        <p className="edit-raffle__confirmation-overlay__box__confirmation-desc">
          A rifa possui clientes cadastrados
        </p>

        <div className="edit-raffle__confirmation-overlay__box__button-wrapper">
          <button
            onClick={handleConfirm}
            className="edit-raffle__confirmation-overlay__box__button-wrapper__confirm-button"
          >
            Confirmar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="edit-raffle__confirmation-overlay__box__button-wrapper__cancel-button"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationBox;