export class SystemInformationItem {
  id!: string;
  value!: string;
}

export class SystemInformationSection {
  id!: string;
  value!: string;
  items!: SystemInformationItem[];
}
