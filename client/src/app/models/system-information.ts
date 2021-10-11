export class SystemInformationItem {
  key!: string;
  keyDescription!: string;
  value!: string;
  valueDescription!: string;
}

export class SystemInformationSection {
  title!: string;
  description!: string;
  items!: SystemInformationItem[];
}
