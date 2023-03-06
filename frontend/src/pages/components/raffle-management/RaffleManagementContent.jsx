import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

import Prizes from '../Prizes';

const RaffleManagementContent = () => {
  const navigate = useNavigate();

  return (
    <div className="raffle-management__content">
      <div className="raffle-management__content__container">
        <div className="raffle-management__content__container__info-wrapper">
          <h1 className="raffle-management__content__container__info-wrapper__title">
            ⚙️ Gerenciador de Rifas
          </h1>

          <button onClick={() => navigate('/create-new-raffle')} type="button" className="raffle-management__content__container__info-wrapper__add-btn">
            <AiOutlinePlus color='white' /> Criar
          </button>
        </div>

        <div className="raffle-management__content__container__raffle-wrapper">
          <ul className="raffle-management__content__container__raffle-wrapper__list">
            <li className="raffle-management__content__container__raffle-wrapper__list__list-item">
              <Link to="/edit-raffle/teste" className="raffle-management__content__container__raffle-wrapper__list__list-item__link">
                <Prizes />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RaffleManagementContent;
