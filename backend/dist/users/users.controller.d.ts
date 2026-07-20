import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        name: string;
        email: string;
        id: string;
        phone: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        addresses: {
            id: string;
            createdAt: Date;
            userId: string;
            label: string;
            street: string;
            city: string;
            country: string;
            isDefault: boolean;
        }[];
    }>;
    updateProfile(req: any, body: any): import(".prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        email: string;
        password: string;
        id: string;
        phone: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isBlocked: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    getAddresses(req: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        street: string;
        city: string;
        country: string;
        isDefault: boolean;
    }[]>;
    addAddress(req: any, body: any): import(".prisma/client").Prisma.Prisma__AddressClient<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        street: string;
        city: string;
        country: string;
        isDefault: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeAddress(req: any, id: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
