import Text from "@/components/common/Text";
import { useModal } from "@/middleware/stores/modal";
import type { Game } from "@/types/Games";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { CaretUpDown, PushPin } from "@phosphor-icons/react";
import MemberLabel from "./MemberLabel";
import clsx from "clsx";

interface GameLabelProps {
  game: Game;
  gameIndex: number;
  pinnedGames: boolean[];
  setPinnedGames: React.Dispatch<React.SetStateAction<boolean[]>>;
  isLastGame?: boolean;
}

const GameLabel = ({
  game,
  gameIndex,
  pinnedGames,
  setPinnedGames,
  isLastGame,
}: GameLabelProps) => {
  const { openModal } = useModal();

  return (
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
          className={isLastGame ? "" : "pb-1 mb-1"}
        >
          <Droppable
            droppableId={String(game.gameId)}
            direction="horizontal"
            type="member"
          >
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={clsx(
                  "relative flex items-center justify-around p-2 px-3 pr-8 border-[0.5px] rounded shadow-sm",
                  snapshot.isDraggingOver ? "!bg-gray-50" : "!bg-white"
                )}
              >
                <button
                  className="p-0 !bg-transparent"
                  onClick={() => {
                    if (game.members.some((member) => member.duplicate)) {
                      return openModal({
                        title: "알림",
                        message:
                          "중복된 참가자가 있는 경우 고정할 수 없습니다.",
                      });
                    }
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
                    color={pinnedGames[gameIndex] ? "#dd9595" : "#c7c7c7"}
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
                      <MemberLabel
                        gameIndex={gameIndex}
                        member={member}
                        memberIndex={memberIndex}
                      />
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
  );
};
export default GameLabel;
