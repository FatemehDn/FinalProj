import { IRoom } from "../model/IRoom";
import { BasicRepo } from "../../basicRepo/basicRepository";
import models from "../../dataBase/models/index";

export class roomRepo extends BasicRepo<IRoom> {
  constructor() {
    super(models.Room);
  }

  public async addRoom(name: string, capacity: number): Promise<any> {
    const existingRoom = await this.existingRoom(name);

    if (existingRoom) {
      return { flag: false, message: "this room already added." };
    }
    models.Room.create({
      name: name,
      capacity: capacity,
    });
    return { flag: true, message: "room added." };
  }

  private async existingRoom(name: string) {
    return await models.Room.findOne({ where: { name } });
  }
}
