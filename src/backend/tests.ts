import {
  removeFromBack,
  removeFromFront,
  NotAtFront,
  NotAtBack,
} from "./util.ts";
import { assertEquals } from "https://deno.land/std@0.76.0/testing/asserts.ts";
Deno.test("remove from back", () => {
  assertEquals(removeFromBack("three", "test one two three"), "test one two ");
});
Deno.test("remove from front", () => {
  assertEquals(removeFromFront("test", "test one two three"), " one two three");
});
Deno.test("remove from front errors", () => {
  assertEquals(removeFromFront("hah", "test one two three"), new NotAtFront());
});
Deno.test("remove from back errors", () => {
  assertEquals(removeFromBack("hah", "test one two three"), new NotAtBack());
});
