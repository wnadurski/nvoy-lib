export interface Props<HookReturn> {
  hook: () => HookReturn
  children: (value: HookReturn) => JSX.Element
}

export const HookToChildren = <HookReturn>({
  hook,
  children,
}: Props<HookReturn>): JSX.Element => {
  return children(hook())
}
