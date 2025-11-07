import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    let user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
      address: createUserDto.address
    })
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "Not found user!"
    return this.userModel.findOne({ _id: id });
  }

  findOneByUserName(username: string) {

    return this.userModel.findOne({ email: username });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);

  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "Not found user!"
    return this.userModel.deleteOne({ _id: id });
  }

  // ✅ Thêm 3 service mới tương ứng 3 endpoint

  // 1️⃣ Tìm user theo tên hoặc email
  async search(keyword: string) {
    if (!keyword || keyword.trim() === '') return [];
    return this.userModel.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ],
    }).select('-password');
  }

  // 2️⃣ Đổi mật khẩu user
  async changePassword(id: string, password: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user!';
    const newHash = this.getHashPassword(password);
    await this.userModel.updateOne({ _id: id }, { password: newHash });
    return 'Password updated successfully';
  }

  // 3️⃣ Lấy thông tin profile chi tiết
  async getProfile(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user!';
    return this.userModel.findById(id).select('-password');
  }
}
