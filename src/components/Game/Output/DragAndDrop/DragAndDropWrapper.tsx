import type { DraggableLocation, DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import GameLabel from "./GameLabel";
import type { Game } from "@/types/Games";
import { reorderArray, updatePlayerOrder, updatePlayerOrderWithGames } from "@/utils/games";

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
      handleOnDragGameEnd(source, destination);
    } else if (type === "member") {
      handleOnDragMemberEnd(source, destination);
    }
  };

  const handleOnDragGameEnd = (
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const newGames = reorderArray(games, source.index, destination.index);
    setGames(newGames);

    const newPinnedGames = reorderArray(
      pinnedGames,
      source.index,
      destination.index
    );
    setPinnedGames(newPinnedGames);
  };

  const handleOnDragMemberEnd = (
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const sourceGameIndex = games.findIndex(
      (game) => game.gameId === Number(source.droppableId)
    );
    const destinationGameIndex = games.findIndex(
      (game) => game.gameId === Number(destination.droppableId)
    );

    if (sourceGameIndex === destinationGameIndex) {
      const newGames = updatePlayerOrder(
        games,
        sourceGameIndex,
        source.index,
        destination.index
      );
      setGames(newGames);
    } else {
      const newGames = updatePlayerOrderWithGames(
        games,
        sourceGameIndex,
        destinationGameIndex,
        source.index,
        destination.index
      );
      setGames(newGames);
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
