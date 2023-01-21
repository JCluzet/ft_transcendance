import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GameService } from "./game.service";
import { IPosition } from "./interface/GameOption.interface";
import { IRoom } from "./interface/room.interface";

@Injectable()
export class PongService {
  constructor(@Inject(forwardRef(() => GameService)) private gameService: GameService) {}

  static option = {
    display: { width: 1920, height: 1080 },
  }

  static velocity = (speed: number, radian: number): IPosition => {
    return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed };
  }

  updateBall(x: number, y: number, radian: number, room: IRoom) {
    room.GameOption.ball.position.x = x;
    room.GameOption.ball.position.y = y;
    room.GameOption.ball.velocity = PongService.velocity((room.GameOption.ball.ballspeed *= 1.01), radian);
    this.gameService.emit(room, "updateBall", room.GameOption.ball.position);
  }

  resetBall(room: IRoom, left?: boolean) {
    let radian = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    if (left) radian += Math.PI;
    this.updateBall(PongService.option.display.width / 2, PongService.option.display.height / 2, radian, room);
  }

  update(room: IRoom) {
    const next = {
      x: room.GameOption.ball.position.x + room.GameOption.ball.velocity.x,
      y: room.GameOption.ball.position.y + room.GameOption.ball.velocity.y,
    }
    if (next.x - (room.GameOption.ball.y / 2) < 0 || next.x + (room.GameOption.ball.y / 2) > PongService.option.display.width) {
      if (next.x > room.GameOption.ball.y / 2) room.player[0].score++;
      else room.player[1].score++;
    }
    this.gameService.emit(room, "scoreUpdate", room.player);
    for (const player of room.player)
      if (player.score === 5)
        return this.gameService.stopGame(room, undefined);
    this.resetBall(room, next.x + (room.GameOption.ball.y / 2) > PongService.option.display.width);
    if (next.y > (room.player[0].position.y + (room.GameOption.cursor.y / 2)) &&
        next.y < (room.player[0].position.y - (room.GameOption.cursor.y / 2))) {
          if (next.x - room.GameOption.ball.y / 2 < room.GameOption.cursor.x)
            return this.updateBall(room.GameOption.ball.position.x, room.GameOption.ball.position.y, (Math.random() * Math.PI) / 2 - Math.PI / 4, room);
        }
    if (next.y > (room.player[0].position.y + (room.GameOption.cursor.y / 2)) &&
        next.y < (room.player[0].position.y - (room.GameOption.cursor.y / 2))) {
          if (next.x + (room.GameOption.ball.y / 2) > PongService.option.display.width - room.GameOption.cursor.x)
          return this.updateBall(room.GameOption.ball.position.x, room.GameOption.ball.position.y, (Math.random() * Math.PI) / 2 - Math.PI / 4 + Math.PI, room);
        }
    if (next.y - room.GameOption.ball.y / 2 < 0 || next.y + room.GameOption.ball.y / 2 > PongService.option.display.height)
        room.GameOption.ball.velocity.y *= -1;
    room.GameOption.ball.position.x += room.GameOption.ball.velocity.x;
    room.GameOption.ball.position.y += room.GameOption.ball.velocity.y;
    this.gameService.emit(room, "updateBall", room.GameOption.ball.position);
  }
}