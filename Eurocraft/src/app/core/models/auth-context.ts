import { UserProfile } from "./user-profile";
import { SimpleClaim } from "./simple-claim";

export class AuthContext {
  UserProfile: UserProfile;
  Claims: SimpleClaim[];
}