import { UserPermission } from "./user-permission";

export class EntityDomain {
    EntityDomainId: number;
    EntityDomainName: string;
    UserPermissions: UserPermission[];
}