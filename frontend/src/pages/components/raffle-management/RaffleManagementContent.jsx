import React, { useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';

import Prizes from '../Prizes';
import useRaffleStore from '../../../stores/useRaffleStore';
import _arrayBufferToBase64 from '../../../hooks/useArrayBufferToBase64';

const RaffleManagementContent = () => {
  const navigate = useNavigate();

  const { raffles, setRaffles } = useRaffleStore(
    (state) => ({
      raffles: state.raffles,
      setRaffles: state.setRaffles,
    })
  )

  useEffect(() => {
    const fetchRaffles = () => {
      api
        .get('/raffle-management/get-raffles')
        .then((res) => {
          setRaffles(res.data);
        })
        .catch((error) => {
          console.log(error);
        })
    }

    fetchRaffles();
  }, [setRaffles]);
  
  useEffect(() => {
    console.log(raffles);
  }, [raffles]);

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
            {
              raffles.map((raffle) => (
                <li key={raffle._id} className="raffle-management__content__container__raffle-wrapper__list__list-item">
                  <Link to={`/edit-raffle/${raffle._id}`} className="raffle-management__content__container__raffle-wrapper__list__list-item__link">
                    <Prizes title={raffle.title} subtitle={raffle.subtitle} image={raffle.raffleImage.data ? `data:${raffle.raffleImage.contentType};base64,${_arrayBufferToBase64(raffle.raffleImage.data.data)}` : null} />
                  </Link>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RaffleManagementContent;
