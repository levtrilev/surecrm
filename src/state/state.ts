import {
  atom,
  atomFamily,
  selector,
} from "recoil";

// ======= common utility object's state ============

export const childModalState = atom({
  key: "childModalState",
  default: false,
});

export const yesCancelState = atomFamily({
  key: "yesCancelState",
  default: false,
});

export const showYesCancelDialogState = atomFamily({
  key: "showYesCancelDialogState",
  default: false,
});

export const isModifiedState = atomFamily({
  key: "isModifiedState",
  default: false,
});

// 'neutral'|'yes'|'no'|'cancel'
export const yesNoCancelState = atomFamily({
  key: "yesNoCancelState",
  default: 'neutral',
});

export const showYesNoCancelDialogState = atomFamily({
  key: "showYesCancelDialogState",
  default: false,
});

// ======= end of common utility object's state ======

// ======= test object's state ============

export const textState = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

export const charCountState = selector({
  key: "charCountState", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const text = get(textState);

    return text.length;
  },
});

export const counterOneState = atom({
  key: "counterOneState", // unique ID (with respect to other atoms/selectors)
  default: 11,
});

export const counterTwoState = atom({
  key: "counterTwoState", // unique ID (with respect to other atoms/selectors)
  default: 22,
});

const postsDefault: PostsType = [
  {
    title: "aaaaaa",
    userId: 0,
    body: "bbbbbbbb",
    id: 0,
  },
  {
    title: "новость!111111",
    body: "string I did it again",
    userId: 0,
    id: 0,
  },
  {
    title: "новость!2",
    body: "string I did it again",
    userId: 0,
    id: 0,
  },
];

export const postsState = atom({
  key: "postsState",
  default: postsDefault,
});

export const openEditModalState = atom({
  key: "openEditModalState",
  default: false,
});

export const postState = selector({
  key: "postState",
  get: ({ get }) => {
    const posts: PostsType = get(postsState);

    return posts[0];
  },
});

export const currentPostsQuery = selector({
  key: "currentPostsQuery",
  get: async ({ get }) => {

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts`
    ).then((response) => response.json());
    return response;
  },
});
