import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from 'geojson';
import { Repository } from 'typeorm';
import { CreateTestlocationDto } from './dto/create-testlocation.dto';
import { UpdateTestlocationDto } from './dto/update-testlocation.dto';
import { TestLocation } from './entities/testlocation.entity';

@Injectable()
export class TestlocationService {
  constructor(
    @InjectRepository(TestLocation)
    private readonly repo: Repository<TestLocation>,
  ) {}
  public async getAll() {
    return await this.repo.find();
  }

  public async create(location: TestLocation) {
    const pointObject: Point = {
      type: 'Point',
      coordinates: [location.long, location.lat],
    };
    location.location = pointObject;
    return await this.repo.save(location);
  }

  public async getRange(lat: number, long: number, range = 1000) {
    const origin = {
      type: 'Point',
      coordinates: [long, lat],
    };
    const locations = await this.repo
      .createQueryBuilder('t_test_location')
      .select([
        't_test_location.city AS city',
        'ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)))/1000 AS distance',
      ])
      .where(
        'ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)',
      )
      .orderBy('distance', 'ASC')
      .setParameters({
        // stringify GeoJSON
        origin: JSON.stringify(origin),
        range: range * 1000, //KM conversion
      })
      .getRawMany();
    return locations;
  }
}
