import { Test } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarMonthlyReport } from './carReportInterfaces';

describe('CatsController', () => {
  let carController: CarController;
  let carService: CarService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CarController],
      providers: [CarService],
    }).compile();

    carService = moduleRef.get<CarService>(CarService);
    carController = moduleRef.get<CarController>(CarController);
  });

  const getType = async (): Promise<CarMonthlyReport[]> => {
    const unemployedCars = [
      {
        carId: 10,
        daysInMonth: 0,
        LP: 'TE-001-ST',
        percentInMonth: 0,
      },
      {
        carId: 11,
        daysInMonth: 0,
        LP: 'TE-002-ST',
        percentInMonth: 0,
      },
      {
        carId: 12,
        daysInMonth: 8,
        LP: 'TE-003-ST',
        percentInMonth: 27,
      },
    ];
    return unemployedCars;
  };

  describe('getType', () => {
    it('should return array of employed and unemployed cars', async () => {
      const cars = getType();
      jest.spyOn(carService, 'getType').mockImplementation(() => getType());
      expect(
        await carService.checkAvgCarEmployment({ month: '2022-09', id: 2 }),
      ).toEqual(cars);
    });
  });
});
