import React from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { FiAlertTriangle } from 'react-icons/fi';
import useQueryNumbersStore from '../../../stores/useQueryNumbersStore';

const QueryNumbersContent = () => {
  const openModal = useQueryNumbersStore((state) => state.openModal);

  return (
    <div className="query-numbers__query-numbers-content">
      <div className="query-numbers__query-numbers-content__container">
        <div className="query-numbers__query-numbers-content__container__above">
          <h1 className="query-numbers__query-numbers-content__container__above__title">
            🛒 Meus números
          </h1>

          <button onClick={openModal} className="query-numbers__query-numbers-content__container__above__search-btn">
            <HiOutlineSearch /> Buscar
          </button>
        </div>

        <div className="query-numbers__query-numbers-content__container__alert-box">
          <FiAlertTriangle /> Faça sua busca <button type="button" onClick={openModal}>clicando aqui</button>
        </div>
      </div>
    </div>
  )
}

export default QueryNumbersContent;
