import useRaffleStore from "../../../stores/useRaffleStore";

const DeleteConfirmationBox = () => {
  const {
    isDeleteConfirmationOpen,
    closeDeleteConfirmation,
    isDeleteConfirmationAnimated,
    deactivateDeleteConfirmationAnimation,
  } = useRaffleStore((state) => ({
    isDeleteConfirmationOpen: state.isDeleteConfirmationOpen,
    closeDeleteConfirmation: state.closeDeleteConfirmation,
    isDeleteConfirmationAnimated: state.isDeleteConfirmationAnimated,
    deactivateDeleteConfirmationAnimation:
      state.deactivateDeleteConfirmationAnimation,
  }));

  const handleCancel = () => {
    deactivateDeleteConfirmationAnimation();

    setTimeout(() => {
      closeDeleteConfirmation();
    }, 1000);
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
          <button className="edit-raffle__confirmation-overlay__box__button-wrapper__confirm-button">
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
