import { Test, TestingModule } from '@nestjs/testing';
import { RentProvidersController } from './rent-providers.controller';

describe('RentProvidersController', () => {
  let controller: RentProvidersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentProvidersController],
    }).compile();

    controller = module.get<RentProvidersController>(RentProvidersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
