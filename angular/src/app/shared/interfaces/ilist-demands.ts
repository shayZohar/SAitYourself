/**
 * demand-list interface
 */

export interface IListDemands {
  request?: string;
  type: string;
}

export let emptyDmands = (): IListDemands => ({
  type: ""
});
