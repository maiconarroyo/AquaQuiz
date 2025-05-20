import "./GameOver.css";

const GameOver = ({retry, score}) => {
  return (
    <div>
        <h1>Fim de Jogo!</h1>
        <h2>
        <span>A sua pontuação foi:<span>{score}</span> </span>
        </h2>
        <button onClick={retry}>Recomeçar</button>
    </div>
  )
}

export default GameOver