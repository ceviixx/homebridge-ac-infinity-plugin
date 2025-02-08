export function convertPercentToNumberAndPercent(percent: number): ReturnStructure {
  if (percent > 0 && percent < 10) {
    return new ReturnStructure(1, 10);
  } else if (percent >= 10 && percent < 20) {
    return new ReturnStructure(2, 20);
  } else if (percent >= 20 && percent < 30) {
    return new ReturnStructure(3, 30);
  } else if (percent >= 30 && percent < 40) {
    return new ReturnStructure(4, 40);
  } else if (percent >= 40 && percent < 50) {
    return new ReturnStructure(5, 50);
  } else if (percent >= 50 && percent < 60) {
    return new ReturnStructure(6, 60);
  } else if (percent >= 60 && percent < 70) {
    return new ReturnStructure(7, 70);
  } else if (percent >= 70 && percent < 80) {
    return new ReturnStructure(8, 80);
  } else if (percent >= 80 && percent < 90) {
    return new ReturnStructure(9, 90);
  } else if (percent >= 90 && percent <= 100) {
    return new ReturnStructure(10, 100);
  } else {
    return new ReturnStructure(0, 0);
  }
}
    
export class ReturnStructure {
  public number: number;
  public percent: number;  

  constructor(number: number, percent: number) {
    this.number = number;
    this.percent = percent;
  }
}