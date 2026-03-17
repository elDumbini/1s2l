import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongodb";
import { CreateUserDTO, CreateUserResponseDTO } from "../dto/users.dto";
import { bcryptService } from "../../core/utils/bcryptService";

// Маппер для преобразования документа MongoDB в доменную модель
const mapDocumentToUser = (doc: any): CreateUserResponseDTO => ({
  id: doc._id.toString(),
  email: doc.email,
  login: doc.login,
  createdAt: doc.createdAt,
});

export const usersRepository = {
  getUserByLoginOrEmail: async (login: string, email: string) => {
    const user = await usersCollection.findOne({
      $or: [{ login }, { email }],
    });
    return user;
  },
  createUser: async (dto: CreateUserDTO): Promise<CreateUserResponseDTO> => {
    const salt = await bcryptService.generateSalt(10);
    const hashedPassword = await bcryptService.generateHash(dto.password, salt);

    const userData = {
      salt,
      hashedPassword,
      email: dto.email,
      login: dto.login,
      createdAt: new Date().toISOString(),
    };

    const result = await usersCollection.insertOne(userData);

    const createdUser = await usersCollection.findOne({
      _id: result.insertedId,
    });
    if (!createdUser) {
      throw new Error("Failed to retrieve created user");
    }

    return mapDocumentToUser(createdUser);
  },
  deleteUser: async (id: string) => {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};
