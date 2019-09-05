import { <%= classify(enumName) %> } from '<%= relativeEnumPath %>';

export const <%= classify(name) %> = [<%for (let en of enums) {%>
  { name: <%=enumName%>.<%=en.key%>, value: '<%=en.value%>' },<%}%>
];
