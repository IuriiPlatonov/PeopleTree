class DialogType {
 
  static Ok = new DialogType("ok")
  static OkNo = new DialogType("okno")

  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name;
  }
}

export { DialogType };