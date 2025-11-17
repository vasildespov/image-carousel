const SIZE = 100;
export class ImageUrlCache {
  private map = new Map<string, true>();
  constructor(private size: number = SIZE) {}
  has(key: string) {
    if (!this.map.has(key)) return false;
    this.map.delete(key);
    this.map.set(key, true);
    return true;
  }
  add(key: string) {
    if (this.map.has(key)) {
      this.map.delete(key);
      this.map.set(key, true);
      return;
    }
    if (this.map.size >= this.size) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }
    this.map.set(key, true);
  }
}
