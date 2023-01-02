import { Token } from 'src/domain/token.entity';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../domain/user.entity';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {}
