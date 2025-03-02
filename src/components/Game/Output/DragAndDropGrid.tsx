import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { CaretUpDown, PushPin } from "@phosphor-icons/react";
import clsx from "clsx";
import { Game } from "../../../types/Games";
import { getDuplicateMembers, getTierGapMembers } from "../../../utils/games";
import Text from "../../common/Text";

interface DragAndDropGridProps {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  pinnedGames: boolean[];
  setPinnedGames: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const DragAndDropGrid = ({
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
              <Draggable
                key={game.gameId}
                draggableId={String(game.gameId)}
                index={gameIndex}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="pb-1 mb-1"
                  >
                    <Droppable
                      droppableId={String(game.gameId)}
                      direction="horizontal"
                      type="member"
                    >
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="relative flex items-center justify-between p-2 px-3 pr-8 bg-white border-[0.5px] rounded shadow-sm"
                        >
                          <button
                            className="p-0"
                            onClick={() => {
                              setPinnedGames([
                                ...pinnedGames.slice(0, gameIndex),
                                !pinnedGames[gameIndex],
                                ...pinnedGames.slice(gameIndex + 1),
                              ]);
                            }}
                          >
                            <PushPin
                              size={18}
                              weight={pinnedGames[gameIndex] ? "fill" : "light"}
                              color={
                                pinnedGames[gameIndex] ? "#dd9595" : "#c7c7c7"
                              }
                            />
                          </button>
                          <div className="flex items-center gap-1">
                            {game.members.map((member, memberIndex) => (
                              <>
                                {memberIndex === 2 ? (
                                  <Text className="mx-0.5">vs</Text>
                                ) : (
                                  ""
                                )}
                                <Draggable
                                  key={`member-${member.member_id}-${gameIndex}-${memberIndex}`}
                                  draggableId={`member-${member.member_id}-${gameIndex}-${memberIndex}`}
                                  index={memberIndex}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={clsx(
                                        "p-1.5 border border-gray-200 rounded bg-white",
                                        member.duplicate ? "!bg-red-600" : "",
                                        member.tierGap === 1
                                          ? "!border !border-orange-300"
                                          : "",
                                        member.tierGap === 2
                                          ? "!border !border-red-600"
                                          : ""
                                      )}
                                    >
                                      {member.name}
                                    </div>
                                  )}
                                </Draggable>
                              </>
                            ))}
                          </div>
                          <div className="absolute right-2.5">
                            <CaretUpDown size={16} weight="light" />
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragAndDropGrid;
