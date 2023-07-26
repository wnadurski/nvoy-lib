import { ComponentMeta } from "@storybook/react"
import { Something } from "../src/Test/Something"

export default {
  title: "Something",
  component: Something,
} as ComponentMeta<typeof Something>

export const SomethingStory = () => <Something />
