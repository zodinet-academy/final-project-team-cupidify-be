import { Profile } from '../../profile/entities/profile.entity';

export interface IUserLocation {
  user: string;
  distance: number;
}

export interface IUserFinded {
  user: Profile;
  distance: number;
}
