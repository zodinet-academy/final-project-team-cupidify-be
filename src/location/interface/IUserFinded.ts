import { ProfileDto } from 'src/profile/dto/profile.dto';

export interface IUserLocation {
  user: string;
  distance: number;
}

export interface IUserFinded {
  user: ProfileDto;
  distance: number;
}
