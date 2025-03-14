import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Game } from "../../../../types/Games";
import {
  getDuplicateMembers,
  getTierGapMembers,
} from "../../../../utils/games";
import GameLabel from "./GameLabel";

interface DragAndDropGridProps {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  pinnedGames: boolean[];
  setPinnedGames: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const DragAndDropWrapper = ({
  games,
  setGames,
  pinnedGames,
  setPinnedGames,
}: DragAndDropGridProps) => {
  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "game") {
      const newGames = Array.from(games);
      const [movedGame] = newGames.splice(source.index, 1);
      newGames.splice(destination.index, 0, movedGame);
      setGames(newGames);

      const newPinnedGames = Array.from(pinnedGames);
      const [movedPinnedGame] = newPinnedGames.splice(source.index, 1);
      newPinnedGames.splice(destination.index, 0, movedPinnedGame);
      setPinnedGames(newPinnedGames);
    } else if (type === "member") {
      const sourceGameIndex = games.findIndex(
        (game) => game.gameId === Number(source.droppableId)
      );
      const destinationGameIndex = games.findIndex(
        (game) => game.gameId === Number(destination.droppableId)
      );

      if (sourceGameIndex === destinationGameIndex) {
        const sourceGame = games[sourceGameIndex];
        const sourceGames = Array.from(sourceGame.members);

        const [movedMember] = sourceGames.splice(source.index, 1);
        sourceGames.splice(destination.index, 0, movedMember);

        const newGames = Array.from(games);
        newGames[sourceGameIndex].members = getTierGapMembers(
          getDuplicateMembers(sourceGames)
        );
        setGames(newGames);
      } else {
        const sourceGame = games[sourceGameIndex];
        const destinationGame = games[destinationGameIndex];

        const sourceGames = Array.from(sourceGame.members);
        const destinationGames = Array.from(destinationGame.members);

        const [movedMember] = sourceGames.splice(source.index, 1);
        const [targetMember] = destinationGames.splice(destination.index, 1);

        sourceGames.splice(source.index, 0, targetMember);
        destinationGames.splice(destination.index, 0, movedMember);

        const newGames = Array.from(games);
        newGames[sourceGameIndex].members = getTierGapMembers(
          getDuplicateMembers(sourceGames)
        );
        newGames[destinationGameIndex].members = getTierGapMembers(
          getDuplicateMembers(destinationGames)
        );
        setGames(newGames);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="all-games" direction="vertical" type="game">
        {(provided) => (
          <div
            className="flex flex-col"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {games.map((game, gameIndex) => (
              <GameLabel
                game={game}
                gameIndex={gameIndex}
                pinnedGames={pinnedGames}
                setPinnedGames={setPinnedGames}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragAndDropWrapper;
