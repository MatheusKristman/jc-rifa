import React from 'react';
import { WinnerBox } from '..';

const WinnersContent = () => {
  return (
    <div className="winners__winners-content">
      <div className="winners__winners-content__container">
        <div className="winners__winners-content__container__infos">
          <h1 className="winners__winners-content__container__infos__title">🏆 Ganhadores</h1>

          <span className="winners__winners-content__container__infos__desc">            
            confira os sortudos
          </span>
        </div>

        <div className="winners__winners-content__container__wrapper">
          <WinnerBox />
          <WinnerBox />
          <WinnerBox />
          <WinnerBox />
          <WinnerBox />
          <WinnerBox />
          <WinnerBox />
          <WinnerBox />
        </div>
      </div>
    </div>
  )
}

export default WinnersContent