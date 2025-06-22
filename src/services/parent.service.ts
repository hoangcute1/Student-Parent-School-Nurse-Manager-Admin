import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Parent, ParentDocument } from '@/schemas/parent.schema';
import { CreateParentDto } from '@/decorations/dto/create-parent.dto';
import { UpdateParentDto } from '@/decorations/dto/update-parent.dto';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name)
    private parentModel: Model<ParentDocument>,
    private profileService: ProfileService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async findAll(): Promise<any[]> {
    const parents = await this.parentModel.find().populate('user').exec();

    // Fetch profiles for all parents
    const parentsWithProfiles = await Promise.all(
      parents.map(async (parent) => {
        // Get the user ID - need to use type assertion since parent.user is populated
        const userId = (parent.user as any)._id;

        // Fetch the profile for this parent's user
        const profile = await this.profileService.findByuser(userId);

        return {
          _id: parent._id,
          user: {
            _id: (parent.user as any)._id,
            email: (parent.user as any).email,
            created_at: (parent.user as any).created_at,
            updated_at: (parent.user as any).updated_at,
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

    return parentsWithProfiles;
  }
  async validateParent(user: string): Promise<ParentDocument | null> {
    const parent = await this.parentModel.findOne({ user }).exec();
    if (!parent) {
      throw new NotFoundException(`Parent with user ID "${user}" not found`);
    }
    return parent;
  }

  async findById(id: string): Promise<ParentDocument> {
    const parent = await this.parentModel.findById(id).populate('user').exec();

    if (!parent) {
      throw new NotFoundException(`Parent with ID "${id}" not found`);
    }
    return parent;
  }

  async findByuser(user: string): Promise<ParentDocument | null> {
    return this.parentModel.findOne({ user: user }).exec();
  }

  async create(createParentDto: CreateParentDto): Promise<ParentDocument> {
    const existingParent = await this.parentModel.findOne({ user: createParentDto.user }).exec();

    if (existingParent) {
      throw new ConflictException('A parent with this user ID already exists');
    }

    const createdParent = new this.parentModel({
      user: createParentDto.user,
    });

    return createdParent.save();
  }

  async update(id: string, updateParentDto: UpdateParentDto): Promise<ParentDocument> {
    const updatedParent = await this.parentModel
      .findByIdAndUpdate(id, updateParentDto, { new: true })
      .exec();

    if (!updatedParent) {
      throw new NotFoundException(`Parent with ID "${id}" not found`);
    }

    return updatedParent;
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const deletedParent = await this.parentModel.findByIdAndDelete(id).exec();

    if (!deletedParent) {
      throw new NotFoundException(`Parent with ID "${id}" not found`);
    }

    return { id, deleted: true };
  }
}
