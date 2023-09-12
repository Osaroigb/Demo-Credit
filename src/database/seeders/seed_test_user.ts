import { Knex } from "knex";
import { hashString } from '../../helpers/utilities';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  const hashedPassword = await hashString("Testing123_");

  // Inserts seed entries
  await knex("users").insert(
    { 
      id: 1, 
      firstName: "John", 
      lastName: "Doe", 
      email: "test@gmail.com", 
      password: hashedPassword, 
      phoneNumber: "+2347056967794" 
    }
  );
};
