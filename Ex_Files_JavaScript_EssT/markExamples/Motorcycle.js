// A motorcycle class
class Motorcycle {
    constructor(
        manufacturer,
        model,
        displacement,
        panniers,
        color,
        tankCapacity,
    )
    {
        this.manufacturer = manufacturer;
        this.model = model;  
        this.displacement = displacement; 
        this.panniers = panniers;  
        this.color = color; 
        this.tankCapacity = tankCapacity; 
    }
    modTank(newCapacity){
        this.tankCapacity = newCapacity;
    }
}
export default Motorcycle;