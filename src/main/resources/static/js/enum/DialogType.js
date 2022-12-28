class DialogType {
  // Create new instances of the same class as static attributes
  static Ok = new DialogType("ok")
  static OkNo = new DialogType("okno")

  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name;
  }
}