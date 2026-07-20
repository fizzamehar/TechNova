import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
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
    updateProfile(userId: string, data: {
        name?: string;
        phone?: string;
        avatar?: string;
    }): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    addAddress(userId: string, data: {
        label: string;
        street: string;
        city: string;
        country: string;
        isDefault?: boolean;
    }): import(".prisma/client").Prisma.Prisma__AddressClient<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        street: string;
        city: string;
        country: string;
        isDefault: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    getAddresses(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        street: string;
        city: string;
        country: string;
        isDefault: boolean;
    }[]>;
    removeAddress(userId: string, addressId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
