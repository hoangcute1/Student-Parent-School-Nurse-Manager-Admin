import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff, StaffDocument } from '@/schemas/staff.schema';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    private profileService: ProfileService,
     @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
  ) {}
  async findAll(): Promise<any[]> {
    const staffs = await this.staffModel.find().populate('user').exec();

    // Create an array of promises to fetch profile for each staff
    const staffsWithProfiles = await Promise.all(
      staffs.map(async (staff) => {
        // Get the user ID from the populated user object
        const userId = (staff.user as any)._id;

        // Fetch the profile for this staff's user
        const profile = await this.profileService.findByuser(userId);

        return {
          _id: staff._id,
          user: {
            _id: (staff.user as any)._id,
            email: (staff.user as any).email,
            created_at: (staff.user as any).created_at,
            updated_at: (staff.user as any).updated_at,
          },
          profile: profile
            ? {
                _id: profile._id,
                name: profile.name,
                gender: profile.gender,
                birth: profile.birth,
                address: profile.address,
                avatar: profile.avatar,
                phone: profile.phone,
                created_at: profile.created_at,
                updated_at: profile.updated_at,
              }
            : null,
        };
      }),
    );

    return staffsWithProfiles;
  }

  async findById(id: string): Promise<any> {
    const staff = await this.staffModel.findById(id).populate('user').exec();
    if (!staff) {
      throw new NotFoundException(`Staff with ID "${id}" not found`);
    }
    const userId = (staff.user as any)._id;
    const profile = await this.profileService.findByuser(userId);

    return {
      _id: staff._id,
      user: {
        _id: (staff.user as any)._id,
        email: (staff.user as any).email,
        created_at: (staff.user as any).created_at,
        updated_at: (staff.user as any).updated_at,
      },
      profile: profile
        ? {
            _id: profile._id,
            name: profile.name,
            gender: profile.gender,
            birth: profile.birth,
            address: profile.address,
            avatar: profile.avatar,
            phone: profile.phone,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          }
        : null,
    };
  }

  async findByuser(user: string): Promise<Staff | null> {
    return this.staffModel.findOne({ user }).exec();
  }

  async validateStaff(user: string): Promise<StaffDocument | null> {
    const staff = await this.staffModel.findOne({ user }).exec();
    if (!staff) {
      throw new NotFoundException(`Staff with user ID "${user}" not found`);
    }
    return staff;
  }

  async create(createStaffDto: any): Promise<Staff> {
    // Check if staff with this user already exists
    const existingStaff = await this.staffModel.findOne({ user: createStaffDto.user }).exec();

    if (existingStaff) {
      throw new ConflictException('A staff with this user ID already exists');
    }

    const createdStaff = new this.staffModel(createStaffDto);
    return createdStaff.save();
  }

  async update(id: string, updateStaffDto: any): Promise<Staff> {
    const updatedStaff = await this.staffModel
      .findByIdAndUpdate(id, { ...updateStaffDto, updatedAt: new Date() }, { new: true })
      .exec();

    if (!updatedStaff) {
      throw new NotFoundException(`Staff with ID "${id}" not found`);
    }

    return updatedStaff;
  }

  async createWithUser(
    userDto: any,
    profileDto: any,
  ): Promise<{ user: any; profile: any; staff: StaffDocument }> {
    // 1. Tạo user
    const user = await this.userService.create(userDto);
    // 2. Tạo profile với userId vừa tạo
    const profile = await this.profileService.create({ ...profileDto, user: user['_id'] });
    // 3. Tạo parent với userId vừa tạo
    const staff = await this.create({ user: user['_id'] });
    return { user, profile, staff };
  }
  async remove(id: string): Promise<any> {
    const deletedStaff = await this.staffModel.findByIdAndDelete(id).exec();

    if (!deletedStaff) {
      throw new NotFoundException(`Staff with ID "${id}" not found`);
    }

    return { id, deleted: true };
  }

  async findByUserId(userId: string): Promise<StaffDocument> {
      const staff = await this.staffModel.findOne({ user: userId }).populate('user').exec();
      if (!staff) {
        throw new NotFoundException(`Staff with user ID "${userId}" not found`);
      }
      return staff;
    }
}
