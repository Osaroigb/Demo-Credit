import { Knex } from "knex";
import { hashString } from '../../helpers/utilities';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  const hashedPassword1 = await hashString("Testing123_");
  const hashedPassword2 = await hashString("Password123_");

  // Inserts seed entries
  await knex("users").insert([ 
    { 
      id: 1, 
      firstName: "Aomine", 
      lastName: "Diaki", 
      email: "test@gmail.com", 
      password: hashedPassword1, 
      phoneNumber: "+2347056967794" 
    },
    { 
      id: 2, 
      firstName: "Tensa", 
      lastName: "Zangetsu", 
      email: "user@gmail.com", 
      password: hashedPassword2, 
      phoneNumber: "09086963690" 
    }
  ]);
};
