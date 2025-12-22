import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { SignUpDto } from "@src/modules/member/application/dto/sign-up.dto";
import { User } from "@src/modules/member/domain/entity/user.entity";
import { IPasswordHasher } from "@src/modules/member/domain/interfaces/password-hasher.interface";
import { IUserRepository } from "@src/modules/member/domain/repository/user.repository.interface";
import { Email } from "@src/modules/member/domain/vo/email.vo";
import { Nickname } from "@src/modules/member/domain/vo/nickname.vo";
import { Password } from "@src/modules/member/domain/vo/password.vo";
import { USER_TOKENS } from "@src/modules/member/user.constant";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(USER_TOKENS.IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const email = Email.create(signUpDto.email);
    const nickname = Nickname.create(signUpDto.nickname);

    const isExist = await this.userRepository.existsByEmail(email);
    if (isExist) {
      throw new BadRequestException("이미 존재하는 이메일입니다.");
    }

    const password = await Password.create(
      signUpDto.password,
      this.passwordHasher,
    );

    const user = User.createLocal({ email, nickname, password });

    await this.userRepository.save(user);
  }
}
