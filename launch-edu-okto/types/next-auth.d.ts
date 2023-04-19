import { Session } from "next-auth";
declare module "next-auth" {
    interface Session {
      id: string;
      admin: boolean;
    }
  
    interface User {
      id: string;
      admin: boolean;
    }
  }