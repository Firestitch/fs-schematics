import { <%= classify(enumName) %> } from '<%= relativeEnumPath %>';

export const <%= classify(name) %> = [<%for (let en of enums) {%>
  { name: '<%=en.key%>', value: <%=enumName%>.<%=en.value%> },<%}%>
];
