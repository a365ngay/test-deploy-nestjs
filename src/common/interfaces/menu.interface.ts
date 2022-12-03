export interface IMenu {
  id: number;
  parentId: number;
  menuName: string;
  displayName: string;
  url: string;
  role: string;
  hasChild: boolean;
  icon: string;
  activeIcon: string;
  position: number;
}