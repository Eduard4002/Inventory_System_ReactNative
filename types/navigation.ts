export type RootStackParamList = {
  // ScreenName: { param1: type1, param2: type2 } | undefined (if no params)

  index: { initialFilter?: "expired" | "expiring_soon" }; // The index screen can take an optional initialFilter parameter.
  AddItem: undefined; // The AddItem screen takes no parameters.
  Info: undefined; // The Info screen takes no parameters.
};
