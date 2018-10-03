import { UserPermission } from "./user-permission";

export class UserProfile {
    UserProfileId: string;
    Email: string;
    FirstName: string;
    LastName: string;
    UserPermissions: UserPermission[];
}